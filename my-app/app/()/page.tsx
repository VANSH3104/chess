import dynamic from 'next/dynamic';

const MainGame = dynamic(() => import('../file'), {
  ssr: false, // Ensure this component is only rendered on the client side
});

const Page = () => {
  return (
    <MainGame />
  );
};

export default Page;
