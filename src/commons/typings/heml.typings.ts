export interface HemlCompileResult {
  errors: Error[];
  html: string;
  metadata: {
    meta: any[];
    subject: string;
    size: string;
  };
}

// validation levels - 'strict'|'soft'|'none'
export enum HemlValidateOption {
  Strict = 'strict',
  Soft = 'soft',
  None = 'none',
}

export class HemlCompileOptions {
  public validate: HemlValidateOption;
  public cheerio: object = {}; // config passed to cheerio parser
  public juice: object = {};
  public beautify: object = {}; // config passed to js-beautify html method
  public elements: any[] = [
    // any custom elements you want to use
  ];

  constructor(validationLevel: HemlValidateOption = HemlValidateOption.Soft) {
    this.validate = validationLevel;
  }
}
