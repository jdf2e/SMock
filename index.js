let smockCore=require('smock-core');
class Smock {
    constructor(options) {
      this.options = options;
    }
    apply(compiler) {
        if(compiler.hooks){
          compiler.hooks.done.tap('Smock', () => {
            smockCore.init(
              this.options
            ); 
          });
        }else{
          compiler.plugin('done',() => {
            smockCore.init(
              this.options
            ); 
          })
        }
    }
  }
module.exports = Smock;