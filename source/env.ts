export default class Env {
  private vals: Record<any, any> = {}

  constructor(private env?: Env) { }

  define(key: any, val: any) {
    this.vals[key] = val
  }

  assign(key: any, val: any): any {
    if (key in this.vals) this.vals[key] = val
    else if (this.env) return this.env.assign(key, val)
    else throw new Error(`unknown variable ${key}`)
  }

  get(key: any): any {
    if (key in this.vals) return this.vals[key]
    else if (this.env) return this.env.get(key)
    else throw new Error(`unknown variable ${key}`)
  }
}