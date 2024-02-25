export interface UserBase {
  /**
   * 名称
   */
  name: string;
  /**
   * 图标-模板字面量类型
   */
  icon: `http${string}` | `<svg${string}` | "";
  /**
   * 访问链接
   */
  url: string;
  /**
   * 用户id
   */
  id: string;
  /**
   * 群组分类-模板字面量类型
   */
  group?: `group_${number}`;
  /**
   * 分类
   */
  status?: string[];
  /**
   * 父类id-模板字面量类型
   */
  parentId?: `parent_${number}`;
}
export interface User extends UserBase {
  /**
   * 子用户
   */
  children?: UserBase[];
}

/**
 * 获取用户分组
 */
export function useUserGroup(userList: UserBase[]) {
  // 根用户
  const rootUsers = userList.filter((item) => !item.parentId);
  // 根子用户
  const rootChildren = userList.filter((item) => item.parentId);
  const group = rootUsers.map((rootUser) => {
    let item: User = {
      ...rootUser,
      children: rootChildren.filter((child) =>
        child.parentId?.endsWith(rootUser.id)
      ),
    };
    return item;
  });
  const groupList = group.reduce((prev, curr) => {
    if (prev[curr.group!] === undefined) {
      prev[curr.group!] = [];
    }
    prev[curr.group!].push(curr);
    return prev;
  }, {} as Record<string, User[]>);
  return groupList;
}
