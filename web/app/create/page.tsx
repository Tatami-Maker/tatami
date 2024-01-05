import CreateFeature from '@/components/create/create-feature';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const type = params.type as string | undefined;

  if (type && !isNaN(parseInt(type))) {
    return <CreateFeature type={parseInt(type)}/>;
  } else {
    return <div className='flex flex-row align-center justify-center mt-12'>Invalid Form Request</div>;
  }

}