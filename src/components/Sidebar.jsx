import React from 'react';
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoHome } from 'react-icons/io5';
import { MdOutlineWorkspacePremium, MdHomeWork } from 'react-icons/md';
import { SiMetasploit, SiExpo } from 'react-icons/si';
import { LuLogIn } from 'react-icons/lu';
import { HiBuildingOffice } from 'react-icons/hi2';


const Sidebars = () => {
  const userRole = useSelector((state) => state.user.role)
  const location = useLocation();
  const currentPath = location.pathname;

  const isAllowed = (item) => {
    if (item.roles && !item.roles.includes(userRole)) return false;
    if (item.excludeRoles && item.excludeRoles.includes(userRole)) return false;
    return true;
  };

  const menuItems = [
    {
      label: <span className='icons_ot'><IoHome /> Dashboard</span>,
      url: '/dashboard',
      className: 'active',
    },

    // {
    //   label: <span className='icons_ot'><MdOutlineWorkspacePremium />Builder Projects</span>,
    //   subMenu: [
    //     {
    //       label: 'Projects Lists ',
    //       url: '/masterprojectslist'
    //     },
    //     {
    //       label: 'Builder Projects',
    //       url: '/masterprojects'
    //     },
    //     {
    //       label: 'Active Projects',
    //       url: '/masteractiveprojects'
    //     },
    //     {
    //       label: 'Inactive Projects',
    //       url: '/masterinactiveprojects'
    //     },
    //     {
    //       label: 'Rejected Projects',
    //       url: '/masterrejectedprojects'
    //     },

    //   ],
    //   roles: ['Builder', 'Exclusive Sales Partner'],
    // },
    // {
    //   label: <span className='icons_ot'><MdOutlineWorkspacePremium />PREMIUM PROJECT LISTINGS</span>,
    //   subMenu: [
    //     {
    //       label: 'Buy Packages',
    //       url: '/packages/sale'
    //     },
    //     {
    //       label: 'Packages Responses',
    //       url: '/packages/sale-active'
    //     },
    //     {
    //       label: 'Post New Project',
    //       url: '/projects/add'
    //     },
    //   ],
    //   roles: ['Builder', 'Exclusive Sales Partner'],
    // },
    // {
    //   label: <span className='icons_ot'> <SiMetasploit />  METAVERSE LISTINGS</span>,
    //   subMenu: [
    //     {
    //       label: 'Buy Packages',
    //       url: '/meta-package/buy'
    //     },
    //     {
    //       label: 'Packages Responses',
    //       url: '/meta-packages/active'
    //     },
    //     {
    //       label: 'Post New Property',
    //       url: '/meta-listing/add'
    //     },
    //   ],
    //   roles: ['Builder', 'Exclusive Sales Partner'],
    // },


    {
      label: <span className='icons_ot'> <SiMetasploit />PREMIUM PROPERTY LISTINGS</span>,
      subMenu: [
        {
          label: 'Buy Packages',
          url: '/packages/sale'
        },
        {
          label: 'Packages Responses',
          url: '/packages/sale-active'
        },
        {
          label: 'Post New Project',
          url: '/property/add'
        },
      ],
      roles: ['Agent', 'Owner'],
    },

    {
      label: <span className='icons_ot'><SiExpo /> AIRPROPX</span>,
      subMenu: [
        {
          label: 'Book a Stall',
          url: '/features'
        },
        {
          label: 'Create Stall',
          url: '/expo/pending'
        },
        // {
        //   label: 'Future Expos',
        //   url: '/expo/future'
        // },
        {
          label: 'On Going Expos',
          url: '/expo/ongoing'
        },
        {
          label: 'Completed Expos',
          url: '/expo/completed'
        },
      ],
      excludeRoles: ['Owner'],
    },


    //     {
    // label: <span className='icons_ot'><LuLogIn /> Builder Box</span>,
    // url: "/model/dashboard",
    //     excludeRoles: ['Owner'],
    // },
    // {
    //   label: <span className='icons_ot'><LuLogIn /> CRM LOGIN</span>,
    //   url: "/assignexe1",
    //   excludeRoles: ['Owner'],
    // },


    // {
    //   label: <span className='icons_ot'><MdHomeWork /> MODEL HOUSE</span>,
    //   submenu: [
    //     {
    //       label: 'Model Dashboard',
    //       url: '/model/dashboard'
    //     }
    //   ],
    //   excludeRoles: ['Owner'],
    // },
    // {
    //   label: <span className='icons_ot'><HiBuildingOffice /> BUILDER BOX</span>,
    //   submenu: [
    //     {
    //       label: 'Customise',
    //       url: '/assignexe1'
    //     }
    //   ],
    //   excludeRoles: ['Owner'],
    // },
    // {
    //   label: <span className='icons_ot'><LuLogIn /> CRM LOGIN</span>,
    //   url: "/assignexe1",
    //   excludeRoles: ['Owner'],
    // }
  ]

  const isActive = (url) => currentPath === url;

  return (
    <Sidebar>
      <Menu>

        <MenuItem component={<Link to="/profile" />} className="text-center menu_border">
          <span>{userRole} Profile</span>
        </MenuItem>

        {menuItems.filter(isAllowed).map((item, index) => {
          if (item.subMenu && item.subMenu.length > 0) {
            return (
              <SubMenu key={index} label={item.label}>
                {item.subMenu.map((sub, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    component={<Link to={sub.url} />}
                    className={isActive(sub.url) ? 'active' : ''}
                  >
                    {sub.label}
                  </MenuItem>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <MenuItem
                key={index}
                component={<Link to={item.url} />}
                className={isActive(item.url) ? 'active' : ''}
              >
                {item.label}
              </MenuItem>
            );
          }
        })}

      </Menu>
    </Sidebar >
  );
};

export default Sidebars;
