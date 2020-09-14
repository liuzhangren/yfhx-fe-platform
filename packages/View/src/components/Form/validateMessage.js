// import { getLocale } from 'umi-plugin-locale'

export const message = {
      default: '%s 验证错误',
      // required: '此项为必填项',
      required: fullFeildName => '此项为必填项',
      enum: '%s 必须从 %s 选择',
      whitespace: '%s 不能为空',
      date: {
        format: '%s date %s is invalid for format %s',
        parse: '%s date could not be parsed, %s is invalid ',
        invalid: '%s date %s is invalid',
      },
      types: {
        string: '%s is not a %s',
        method: '%s is not a %s (function)',
        array: '%s is not an %s',
        object: '%s is not an %s',
        number: '%s is not a %s',
        date: '%s is not a %s',
        boolean: '%s is not a %s',
        integer: '%s is not an %s',
        float: '%s is not a %s',
        regexp: '%s is not a valid %s',
        email: '%s is not a valid %s',
        url: '%s is not a valid %s',
        hex: '%s is not a valid %s',
      },
      string: {
        len: '%s 必须为 %s 个字符',
        min: '%s 不能少于 %s 个字符',
        max: '%s 不能多余 %s 个字符',
        range: '%s 必须在 %s 到 %s 个字符之间',
      },
      number: {
        len: '%s 长度必须为 %s',
        min: '%s 不能小于 %s',
        max: '%s 不能大于 %s',
        range: '%s 必须在 %s 到 %s 之间',
      },
      array: {
        len: '%s must be exactly %s in length',
        min: '%s cannot be less than %s in length',
        max: '%s cannot be greater than %s in length',
        range: '%s must be between %s and %s in length',
      },
      pattern: {
        mismatch: '%s value %s does not match pattern %s',
      },
      clone() {
        const cloned = JSON.parse(JSON.stringify(this));
        cloned.clone = this.clone;
        return cloned;
      },
  };


  /**
   * 得到表单国际化化验证信息配置
   */
  export function getValidateMessage(){
    // const locale = getLocale();
    return message;
  }