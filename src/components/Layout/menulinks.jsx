import { TbSettings2 } from 'react-icons/tb';

import { AiOutlineTrophy } from 'react-icons/ai';
import { VscGraph } from 'react-icons/vsc';
import { LuWaves } from 'react-icons/lu';
import { CgInfo } from 'react-icons/cg';

const menuLinks = [
  {
    name: 'My Echos',
    link: '/main',
    icon: <LuWaves />,
  },

  {
    name: 'Achivements',
    link: '/achivements',
    icon: <AiOutlineTrophy />,
  },
  {
    name: 'Statistics',
    link: '/stats',
    icon: <VscGraph />,
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: <TbSettings2 />,
  },
  {
    name: 'Info',
    link: '/info',
    icon: <CgInfo />,
  },
];

export default menuLinks;
