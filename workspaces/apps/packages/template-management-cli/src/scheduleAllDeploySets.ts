import { start } from './image';
import { getAllBuildSets } from '@goldstack/template-metadata';

export const scheduleAllDeploySets = async (argv: any): Promise<void> => {
  const sets = await getAllBuildSets();

  for (const set of sets) {
    const setName = set.buildSetName;
    const result = await start({
      deploymentName: argv.deployment,
      env: [
        {
          name: 'DEBUG',
          value: 'true',
        },
      ],
      command: [
        'deploy-set',
        '--set',
        setName,
        '--deployment',
        argv.deployment,
        '--repo',
        argv.repo,
        '--workDir',
        '/tmp/',
        '--emailResultsTo',
        argv.emailResultsTo || 'false',
        '--skipTests',
        argv.skipTests || 'false',
      ],
    });
    console.log('Deploy Set:', setName);
    console.log('Task ARN:', result.taskArn);
    console.log('Task ID:', result.taskId);
    console.log('ECS Console:', result.ecsConsoleLink);
    console.log('CloudWatch Logs:', result.awsLogsConsoleLink);
    console.log('--------------------------');
  }
};
