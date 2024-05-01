import {
  AchivePage,
  EchoSystemPage,
  EditEchoPage,
  GuidePage,
  HowToUsePage,
  InfoPage,
  MainPage,
  NewEchoPage,
  NotificationPage,
  SettingsPage,
  StatPage,
} from '.';
import Layout from '@/components/Layout/Layout';

const router = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <GuidePage />,
      },
      {
        path: '/main',
        element: <MainPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/achivements',
        element: <AchivePage />,
      },
      {
        path: '/stats',
        element: <StatPage />,
      },
      {
        path: '/info',
        element: <InfoPage />,
      },
      {
        path: '/info/howto',
        element: <HowToUsePage />,
      },
      {
        path: '/info/system',
        element: <EchoSystemPage />,
      },
      {
        path: '/info/notif',
        element: <NotificationPage />,
      },
      {
        path: '/echo/create',
        element: <NewEchoPage />,
      },
      {
        path: '/echo/edit',
        element: <EditEchoPage />,
      },
    ],
  },
];

export default router;
