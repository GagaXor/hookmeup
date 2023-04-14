import type { V2_MetaFunction as MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  Navbar,
  Dropdown,
  Avatar,
  Card,
  Button,
  Pagination,
  Sidebar,
} from "flowbite-react";

import { useOptionalUser } from "~/utils";
import {
  RiMapPin2Fill,
  RiPhoneFill,
  RiMenFill,
  RiMenuFill,
} from "react-icons/ri";
import {HiChartPie, HiViewBoards, HiInbox, HiUser, HiShoppingBag, HiTable, HiArrowSmRight} from "react-icons/hi"
import { useState } from "react";
export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const [collapsed, setCollapsed] = useState(true);
  const user = useOptionalUser();

  function onPageChange() {}
  return (
    <>
      <Navbar
        fluid={true}
        rounded={true}
        className=" fixed left-0 right-0 top-0 z-20"
      >
        <Navbar.Brand href="#">
          <div className="text-white" onClick={() => setCollapsed(!collapsed)}>
            <RiMenuFill className="text-lg font-bold "></RiMenuFill>
          </div>

          <img
            src="/icons8-doggy-51.png"
            className="mr-3 h-6 sm:h-9"
            alt="HookMeUp"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            HookMeUp
          </span>
        </Navbar.Brand>
        <div className="flex gap-4 md:order-2">
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-md font-bold">Bonnie Green</span>
              <span className="block text-md font-bold">@bonniegreen</span>
              <span className="block truncate text-sm font-medium">
                bonniegreen@hookmeup.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Sign out</Dropdown.Item>
            <Dropdown.Item>Location: Nigeria</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
           
          </Dropdown>
        </div>
      </Navbar>

      <div className="flex">
        <div className="fixed z-10 w-fit">
          <Sidebar
            collapsed={collapsed}
            
            aria-label="Default sidebar example"
          >
            <Sidebar.Logo
      href="#"
      img="cons8-doggy-51.png"
      imgAlt="HookMeUp logo"
    >
      HookMeUp
    </Sidebar.Logo>
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item
          href="#"
          icon={HiChartPie}
        >
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiViewBoards}
        >
          Kanban
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiInbox}
        >
          Inbox
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiUser}
        >
          Users
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiShoppingBag}
        >
          Products
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiArrowSmRight}
        >
          Sign In
        </Sidebar.Item>
        <Sidebar.Item
          href="#"
          icon={HiTable}
        >
          Sign Up
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
          </Sidebar>
        </div>

        <main className="relative min-h-screen  sm:flex sm:items-center sm:justify-center ">
          <div className="relative sm:pb-16 sm:pt-8">
            <div className="mx-auto max-w-7xl px-1 py-2 sm:px-2 lg:px-8">
              <div className="... mt-3 flex flex-wrap justify-center gap-4 ">
                {[
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Fly.io",
                    name: "Mimi Baby",
                    location: "Ikeja, Lagos",
                    href: "https://fly.io",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "SQLite",
                    href: "https://sqlite.org",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Prisma",
                    href: "https://prisma.io",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Tailwind",
                    href: "https://tailwindcss.com",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Cypress",
                    href: "https://www.cypress.io",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "MSW",
                    href: "https://mswjs.io",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Vitest",
                    href: "https://vitest.dev",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Testing Library",
                    href: "https://testing-library.com",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "Prettier",
                    href: "https://prettier.io",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "ESLint",
                    href: "https://eslint.org",
                  },
                  {
                    src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
                    alt: "TypeScript",
                    href: "https://typescriptlang.org",
                  },
                ].map((img) => (
                  <div key={img.href} className="max-w-sm">
                    <Card className="grid  justify-center p-1 transition hover:grayscale-0 focus:grayscale-0">
                      <div className="object-contain">
                        <img
                          alt={img.alt}
                          src={img.src}
                          className="rounded-xl object-contain"
                        ></img>

                        <h6 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {img.name}
                        </h6>

                        <p className="font-normal text-green-400">
                          Here are the biggest enterprise technology
                          acquisitions of 2021 so far, in reverse chronological
                          order.
                        </p>
                        <div className="flex flex-wrap gap-6">
                          <div>
                            <div className="flex flex-wrap gap-3">
                              <RiPhoneFill className="mt-1.5 text-white"></RiPhoneFill>
                              <p className="text-white">+234749485653</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <RiMapPin2Fill className="mt-1.5 text-white"></RiMapPin2Fill>
                              <p className="text-white">{img.location}</p>
                            </div>
                          </div>
                          <Link to={img.href}>
                            <Button className="mt-1">View Profile</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
