实现一个倒计时按钮的react组件。

场景说明：点击按钮后，请求后端去发送短信验证码。按钮会进行倒计时，倒计时过程中不允许再次点击。

业务要求：

以秒为单位，可以配置。支持自定义文案，比如 ’60s后可再次发送’ ， ‘请耐心等待60s'。
按钮有多种状态，比如填写的手机号格式不对，不允许点击等状态。请根据情况，自行设计。
点击后，允许通过某种机制 reset。比如用户点击后，按钮进入倒计时状态（或者进入等待状态），同时发送ajax到后端，后端验证手机号在系统中不存在，因此没有发送短信，这时手机要重置到初始状态。
按钮可能会被unmount。
其他属性自动传递下去。

工程要求：

请尽可能补全工程细节，必须提供测试，其他包括但不限于代码规范, 文档，使用demo等。
