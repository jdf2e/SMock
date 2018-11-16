
#### 为什么我启动不了服务？

检查 SMock.json 文件中的配置是否输入正确；
检查配置中输入的 host 是否可以访问；
如果是在内网中访问，检查 host 和 domain 是否配置正确；
检查本机端口号 mockPort 是否被占用。

#### 参数中 host 和 domain 有什么区别？

host 和 domain 都可以使用域名，主要用于区分 swagger 文档地址是否能在外网中访问。

host 指的是文档地址的 ip 或者域名；domain 指的是文档地址的域名；
如果文档地址可以在外网中访问，只配置 host 即可；如果文档地址只能在内网中访问，则 host 和 domain 需要同时配置，host 指的是文档地址的 ip。

#### host 和 port 设置了以后，还是报错？

检查下 swagger 文档地址中的路径是否是 default(/v2/api-docs)；
如果不是默认的 default(/v2/api-docs)，则需要配置 path。

#### https 协议的 swagger 文档要怎么配置？

SMock.json 文件中的参数 customProtocol 指的是文档地址协议，默认为http。如果访问的是 https 协议的文档，则需要配置 customProtocol: https。

#### 只配置了 host ，提示跨域？

如果访问的是内网 swagger 文档地址，host 和 domain 需要同时配置，host 指的是文档地址的 ip、domain 指的是文档地址域名。

#### 启动服务成功，但是访问给定的 http://127.0.0.1:3000 报错？

当出现该问题时，试下将 http://127.0.0.1:3000 改为 http://localhost:3000 访问。