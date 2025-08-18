// 系统配置
export const systemConfig = {
  // 系统名称
  systemName: process.env.NEXT_PUBLIC_SYSTEM_NAME || "Skylark Admin",
  // 系统版本
  systemVersion: process.env.NEXT_PUBLIC_SYSTEM_VERSION || "v1.0.1",
  // 系统描述
  systemDescription: process.env.NEXT_PUBLIC_SYSTEM_DESCRIPTION || "Community Edition",
  // 系统Logo
  systemLogo: process.env.NEXT_PUBLIC_SYSTEM_LOGO || "SK",
  // 系统主题色
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#8b5cf6",
  // 系统副标题
  systemSubtitle: process.env.NEXT_PUBLIC_SYSTEM_SUBTITLE || "Management System",
};

// 获取系统名称
export const getSystemName = () => systemConfig.systemName;

// 获取系统版本
export const getSystemVersion = () => systemConfig.systemVersion;

// 获取系统描述
export const getSystemDescription = () => systemConfig.systemDescription;

// 获取系统Logo
export const getSystemLogo = () => systemConfig.systemLogo;

// 获取主题色
export const getPrimaryColor = () => systemConfig.primaryColor;

// 获取系统副标题
export const getSystemSubtitle = () => systemConfig.systemSubtitle; 