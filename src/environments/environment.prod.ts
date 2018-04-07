type CordateConfig = {
  rosetteUrl: string,
  applicationName: string,
};

function readCordateConfiguration(): CordateConfig {
  const cordateConfig: CordateConfig = (<any>window).cordateConfig;
  return cordateConfig ? cordateConfig : <CordateConfig>{};
}

export const environment = {
  production: true,

  rosetteUrl: readCordateConfiguration().rosetteUrl,
  applicationName: readCordateConfiguration().applicationName,
};