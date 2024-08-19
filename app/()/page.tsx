import { Authmain } from './components/authmain';

export default function Home() {
  return (
    <div>
      <div className="bg-[url('/images/piotr-makowski-27LH_0jXKYI-unsplash.jpg')] h-screen bg-cover bg-center flex justify-center items-center">
        <div className="">
          <Authmain />
        </div>
      </div>
    </div>
  );
}
