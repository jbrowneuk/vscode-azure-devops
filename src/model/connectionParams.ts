/**
 * An interface encapulating the required data to connect to an Azure DevOps service
 */
export interface ConnectionParams {
    organizationUrl: string;
    projectName: string;
    token: string;
}