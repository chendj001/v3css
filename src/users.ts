const img =
  "https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-avt-0015_a86e56c980b7955312b5702a547a4cf0~c5_80x80.jpeg?from=2956013662";

interface User {
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
interface Group extends User {
  /**
   * 子用户
   */
  children?: User[];
}

export const userGroup: User[] = [
  {
    name: "九转灵山",
    icon: "https://avatars.githubusercontent.com/u/105529957",
    url: "",
    id: "001",
    group: "group_10001",
    status: ["5.0⭐", "程序", "游戏", "动漫"],
  },
  {
    name: "github",
    id: "100001",
    url: "",
    icon: img,
    parentId: "parent_001",
  },
  {
    name: "bilibili",
    id: "100002",
    url: "",
    icon: "",
    parentId: "parent_001",
  },
  {
    name: "抖音",
    id: "100003",
    url: "",
    icon: "",
    parentId: "parent_001",
  },
  {
    name: "代码工具",
    icon: "",
    url: "",
    id: "002",
    group: "group_10002",
  },
  {
    name: "vscode",
    icon: "https://api.iconify.design/skill-icons:vscode-light.svg",
    url: "",
    id: "100004",
    parentId: "parent_002",
  },
];

/**
 * 获取用户分组
 */
export function useUserGroup(userList: User[]) {
  // 根用户
  const rootUsers = userList.filter((item) => !item.parentId);
  // 根子用户
  const rootChildren = userList.filter((item) => item.parentId);
  const group = rootUsers.map((rootUser) => {
    let item: Group = {
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
  }, {} as Record<string, Group[]>);
  return groupList;
}
