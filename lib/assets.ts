import { Aws, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import * as path from "path";
import * as ecrdeploy from 'cdk-ecr-deployment';
import { Repository } from "aws-cdk-lib/aws-ecr";

export interface AssetStackProps extends StackProps {
  repositoryName: string;

}

export class AssetsStack extends Stack {
  constructor(scope: Construct, id: string, props: AssetStackProps) {
    super(scope, id, props);

    const repo = new Repository(this, "repo", {
      repositoryName: props.repositoryName,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const image = new DockerImageAsset(this, `docker-image`, {
      directory: path.join(__dirname), // Dockerfileがあるディレクトリを指定
    });

    new ecrdeploy.ECRDeployment(this, 'DeployDockerImage', {
      src: new ecrdeploy.DockerImageName(image.imageUri),
      dest: new ecrdeploy.DockerImageName(`${Aws.ACCOUNT_ID}.dkr.ecr.${Aws.REGION}.amazonaws.com/${repo.repositoryName}`),
    })
  }
}
