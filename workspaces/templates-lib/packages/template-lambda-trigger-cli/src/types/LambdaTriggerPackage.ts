import { AWSDeployment } from '@goldstack/infra-aws';
import { TerraformDeployment } from '@goldstack/utils-terraform';
import { Deployment, DeploymentConfiguration } from '@goldstack/infra';
import { Package, Configuration } from '@goldstack/utils-package';
import {
  LambdaConfiguration,
  LambdaDeployment,
  LambdaDeploymentConfiguration,
  LambdaDeployments,
  LambdaPackage,
} from '@goldstack/template-lambda-cli';

/**
 * Optional schedule in which the lambda is triggered. Example: "rate(1 minute)".
 *
 * @title Lambda Schedule
 * @pattern ^[^\s]
 *
 */

export type LambdaSchedule = string;

/**
 * Name of the SQS queue that is used to trigger the lambda. SQS queue should not exist and will be created when the name is provided.
 *
 * @title SQS Queue Name
 */
export type SQSQueueName = string;

export interface ThisDeploymentConfiguration
  extends DeploymentConfiguration,
    LambdaDeploymentConfiguration {
  schedule?: LambdaSchedule;
  sqsQueueName?: SQSQueueName;
}

export interface ThisDeployment
  extends Deployment,
    AWSDeployment,
    LambdaDeployment,
    TerraformDeployment {
  configuration: ThisDeploymentConfiguration;
}

/**
 * Places where the lambda should be deployed to.
 *
 * @title Deployments
 */
export type LambdaTriggerDeployments = ThisDeployment[];

/**
 * Configures this lambda.
 *
 * @title Lambda Configuration
 *
 */
export type ThisPackageConfiguration = Configuration;

/**
 * A lambda deployment for a lambda that is triggered.
 *
 * @title Lambda Trigger Package
 */
export interface ThisPackage extends Package, LambdaPackage {
  configuration: ThisPackageConfiguration;
  deployments: LambdaTriggerDeployments;
}

export { ThisDeploymentConfiguration as LambdaTriggerDeploymentConfiguration };
export { ThisDeployment as LambdaTriggerDeployment };
export { ThisPackageConfiguration as LambdaTriggerConfiguration };
export { ThisPackage as LambdaTriggerPackage };
