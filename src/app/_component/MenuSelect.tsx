import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useUserStore } from '../../../stores/userStore';
import { MenuItem } from '../../../stores/userStore';
import Icon from '@mui/material/Icon';

interface MenuSelectProps {
  selectedMenus?: string[]
  onMenuChange?: (selectedMenus: string[]) => void
  roleId?: string
}

const MenuTreeItem: React.FC<{
  menu: MenuItem
  selectedMenus: string[]
  onMenuChange: (menuId: string, checked: boolean) => void
  level?: number
}> = ({ menu, selectedMenus, onMenuChange, level = 0 }) => {
  const isChecked = selectedMenus.includes(menu.code);
  const hasChildren = menu.children && menu.children.length > 0

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    onMenuChange(menu.code, checked);
  };

  return (
    <Box key={menu.id} sx={{ display: 'flex', flexDirection: 'column', ml: level * 2 }}>
      <FormControlLabel
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {menu.icon && <Icon sx={{ fontSize: '1rem' }}>{menu.icon}</Icon>}
            <span>{menu.name || menu.title}</span>
          </Box>
        }
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleChange}
            indeterminate={hasChildren && selectedMenus.some(code => 
              menu.children?.some(child => child.code === code)
            )}
          />
        }
      />
      {hasChildren && (
        <Box sx={{ ml: 2 }}>
          {menu.children?.map((child) => (
            <MenuTreeItem
              key={child.id}
              menu={child}
              selectedMenus={selectedMenus}
              onMenuChange={onMenuChange}
              level={level + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default function MenuSelect({ selectedMenus = [], onMenuChange }: MenuSelectProps) {
  const { user } = useUserStore()
  const [localSelectedMenus, setLocalSelectedMenus] = React.useState<string[]>(selectedMenus)

  React.useEffect(() => {
    setLocalSelectedMenus(selectedMenus)
  }, [selectedMenus]);

  const handleMenuChange = (menuCode: string, checked: boolean) => {
    let newSelectedMenus: string[]

    if (checked) {
      newSelectedMenus = [...localSelectedMenus, menuCode]
    } else {
      newSelectedMenus = localSelectedMenus.filter(code => code !== menuCode)
    }

    setLocalSelectedMenus(newSelectedMenus)

    if (onMenuChange) {
      onMenuChange(newSelectedMenus)
    }
  }



  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) {
      // 获取所有菜单编码
      const allMenuCodes = getAllMenuCodes(user?.menus || []);
      setLocalSelectedMenus(allMenuCodes);
      if (onMenuChange) {
        onMenuChange(allMenuCodes);
      }
    } else {
      setLocalSelectedMenus([]);
      if (onMenuChange) {
        onMenuChange([]);
      }
    }
  }

  const getAllMenuCodes = (menus: MenuItem[]): string[] => {
    const result: string[] = []
    menus.forEach(menu => {
      result.push(menu.code)
      if (menu.children && menu.children.length > 0) {
        result.push(...getAllMenuCodes(menu.children))
      }
    })
    return result;
  }

  const allMenuCodes = getAllMenuCodes(user?.menus || [])
  const isAllSelected = allMenuCodes.length > 0 && localSelectedMenus.length === allMenuCodes.length
  const isIndeterminate = localSelectedMenus.length > 0 && localSelectedMenus.length < allMenuCodes.length

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <FormControlLabel
        label="全选"
        control={
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleSelectAll}
          />
        }
      />
      
      {user?.menus.map((menu) => (
        <MenuTreeItem
          key={menu.id}
          menu={menu}
          selectedMenus={localSelectedMenus}
          onMenuChange={handleMenuChange}
        />
      ))}
    </Box>
  );
}
