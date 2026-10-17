export interface SubMenuItem {
  name: string;
  path: string;
  icon?: string;
}

export interface MenuItem {
  name: string;
  path?: string;
  fragment?: string;
  submenu?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  { name: 'Home', path: '/' },
  {
    name: 'Bands',
    submenu: [
      { 
        name: 'Canvas Catalyst', 
        path: '/band/canvas-catalyst',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1778199767/canvas-catalyst-rectangle_nn1btk.jpg'
      },
      { 
        name: 'Cloud Canvas', 
        path: '/band/cloud-canvas',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1778199760/cloud-canvas-rectangle_fqz8n2.jpg'
      },
      { 
        name: 'Rye Canvas', 
        path: '/band/rye-canvas',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1778199753/rye-canvas-rectangle_xtegag.jpg'
      },
      { 
        name: 'Wailing Canvas', 
        path: '/band/wailing-canvas',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1778199747/wailing-canvas-rectangle_gqgvtb.jpg'
      },
      { 
        name: 'Phosphorescent Canvas', 
        path: '/band/phosphorescent-canvas',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1778199740/phosphorescent-canvas-rectangle_s0xjvd.jpg'
      },
      { 
        name: 'Flickering Canvas', 
        path: '/band/flickering-canvas',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1791728697/flickering-canvas-rectangle_m63mwh.jpg'
      },
      { 
        name: 'Stained Glass Canvas', 
        path: '/band/stained-glass-canvas',
        icon: 'https://res.cloudinary.com/des66zgsp/image/upload/v1778199740/phosphorescent-canvas-rectangle_s0xjvd.jpg'
      }
    ]
  },
  { name: 'Tour', path: '/', fragment: 'tour' },
  { name: 'Art', path: '/art' },
  { name: 'Contact', path: '/contact' }
];