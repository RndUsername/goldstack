import { HetznerVPSDeployment } from '@goldstack/template-hetzner-vps';
import { logger } from '@goldstack/utils-cli';
import { cp, exec, read, rmSafe, write, zip } from '@goldstack/utils-sh';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';

// Method to build the deployment files (preparing the staging directory, secrets, and creating the zip)
export const build = async (deployment: HetznerVPSDeployment) => {
  const sourceDir = 'server/';
  const stagingDir = 'dist/server';
  const zipPath = 'dist/server.zip';
  const secretsStagingDir = 'dist/server/secrets';
  const credentialsDestPath = 'dist/server/credentials.json';
  const credentialsFilePath = './credentials.json';

  try {
    await rmSafe(stagingDir);
    cp('-rf', sourceDir, stagingDir);

    const envVariables = deployment.configuration.environmentVariables;
    if (envVariables) {
      const envContent = envVariables
        .map(
          (envVar) =>
            `${envVar.name}="${envVar.value
              .replace(/"/g, '\\"')
              .replace(/\\/g, '\\\\')}"`
        )
        .join('\n');
      const envFilePath = `${stagingDir}/.env`;
      write(envContent, envFilePath);
    }

    if (existsSync(credentialsFilePath)) {
      cp('-rf', credentialsFilePath, credentialsDestPath);
      const credentials = JSON.parse(read(credentialsFilePath));
      const deploymentCredentials = credentials[deployment.name];
      if (deploymentCredentials) {
        await rmSafe(secretsStagingDir);
        mkdirSync(secretsStagingDir, { recursive: true });
        for (const [key, value] of Object.entries(deploymentCredentials)) {
          const secretFilePath = join(secretsStagingDir, `${key}.txt`);
          writeFileSync(secretFilePath, value as string);
          logger().info(`Extracted secret for key: ${key}`);
        }
      }
    }

    // Create the zip file
    logger().info(`Creating zip from ${stagingDir}...`);
    await zip({
      directory: stagingDir,
      target: zipPath,
    });

    // Get the size of the zip file
    const stats = await stat(zipPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = (fileSizeInBytes / 1024).toFixed(2);

    logger().info(`Zip file size: ${fileSizeInMegabytes} kB`);
    logger().info('Build completed successfully.');

    return {
      zipPath,
    };
  } catch (error) {
    logger().error(`Error during build: ${error}`);
    throw error;
  }
};

// Helper function to execute commands remotely via SSH
const sshExec = (host: string, command: string): string => {
  const sshCmd = `ssh  -o StrictHostKeyChecking=no ${host} "${command}"`;
  return exec(sshCmd);
};

// Helper function to upload files via SCP
const scpUpload = (
  localPath: string,
  remotePath: string,
  host: string
): string => {
  const scpCmd = `scp  -o StrictHostKeyChecking=no ${localPath} ${host}:${remotePath}`;
  return exec(scpCmd);
};

// Deploy function
export const sshDeploy = async (deployment: HetznerVPSDeployment) => {
  try {
    const deploymentsInfo = JSON.parse(read('src/state/deployments.json'));
    const deploymentState = deploymentsInfo.find(
      (e: any) => e.name === deployment.name
    );
    if (!deploymentState) {
      logger().error(
        'Cannot build ' +
          deployment.name +
          ' since infrastructure not provisioned yet.'
      );
      throw new Error(`No deployment state found for ${deployment.name}`);
    }

    const host = 'goldstack@' + deploymentState.terraform.ipv4_address.value;
    // Ensure build was completed separately and get the zip path and host
    const { zipPath } = await build(deployment);

    // Step 2: Upload the zip file via SCP
    logger().info('Uploading zip file...');
    scpUpload(zipPath, '/home/goldstack', host);

    // Step 5: Run deploy.sh to stop the app, unzip the file, unpack secrets, and start the app
    logger().info('Running deploy.sh...');
    sshExec(host, 'bash /home/goldstack/deploy.sh');

    logger().info('Deployment completed successfully.');
  } catch (error) {
    logger().error(`Error during deployment: ${error}`);
    throw error;
  }
};
