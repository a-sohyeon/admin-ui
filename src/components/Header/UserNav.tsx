import Link from "next/link";
import { Icon } from "../Icons";

const userNavList = [
  { title: "내정보", icon: <Icon type="member" />, url: "#" },
  { title: "계정관리", icon: <Icon type="settings" />, url: "#" },
  { title: "로그아웃", icon: <Icon type="logout" />, url: "#" },
];

export const UserNav = () => {
  return (
    <div className="flex items-center gap-[2rem] ml-auto text-base text-secondary-8 [&>a]:flex [&>a]:items-center [&>a]:gap-[0.4rem] [&_svg]:text-secondary-6">
      {userNavList.map((list) => (
        <Link href={"#"} key={list.title}>
          {list.icon}
          {list.title}
        </Link>
      ))}
    </div>
  );
};
