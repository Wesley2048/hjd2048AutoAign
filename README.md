# hjd2048AutoAign
通过github action每天免费hjd2048自动签到

## 使用方法
fork本仓库, 修改config/Config.js里面的配置
- BASE_URL 可以换成任何一个镜像, 或者通过发送邮件hjd2048#gmail.com来获取
- ACCOUNT : 账号
- PASSWORD : 密码
- QUESTION : 无安全问题是0, "我爸爸的出生地"是1, 按照顺序填写
- ANSWER : 安全问题的答案

然后提交代码之后, 会自动执行github action就帮你自动签到了, 每天也会定时执行, UTC 0,4,8,12,16,20, 没隔4个小时会执行一次.

有问题欢迎提交issue, 有其他需求的话, 也欢迎提issue联系.
