# 系统配置说明

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下配置：

```bash
# 系统配置
NEXT_PUBLIC_SYSTEM_NAME=Skylark Admin
NEXT_PUBLIC_SYSTEM_VERSION=v1.0.1
NEXT_PUBLIC_SYSTEM_DESCRIPTION=Community Edition
NEXT_PUBLIC_SYSTEM_LOGO=SK
NEXT_PUBLIC_PRIMARY_COLOR=#8b5cf6
NEXT_PUBLIC_SYSTEM_SUBTITLE=Management System

# API配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# 界面配置
NEXT_PUBLIC_DRAWER_WIDTH=280
```

## 配置参数说明

| 参数名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_SYSTEM_NAME` | 系统名称 | "Skylark Admin" |
| `NEXT_PUBLIC_SYSTEM_VERSION` | 系统版本 | "v1.0.1" |
| `NEXT_PUBLIC_SYSTEM_DESCRIPTION` | 系统描述 | "Community Edition" |
| `NEXT_PUBLIC_SYSTEM_LOGO` | 系统Logo文字 | "SK" |
| `NEXT_PUBLIC_PRIMARY_COLOR` | 主题色 | "#8b5cf6" |
| `NEXT_PUBLIC_SYSTEM_SUBTITLE` | 系统副标题 | "Management System" |

## 使用方法

在代码中导入配置函数：

```typescript
import { 
  getSystemName, 
  getSystemVersion, 
  getSystemDescription, 
  getSystemLogo,
  getPrimaryColor,
  getSystemSubtitle 
} from '../lib/config';

// 使用示例
const systemName = getSystemName(); // 获取系统名称
const systemVersion = getSystemVersion(); // 获取系统版本
```

## 注意事项

1. 所有环境变量必须以 `NEXT_PUBLIC_` 开头才能在客户端使用
2. 修改环境变量后需要重启开发服务器
3. 生产环境请确保正确设置这些环境变量 