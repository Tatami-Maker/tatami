import CreateFeature from '@/components/create/create-feature';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default function Page({searchParams}: Params) {
  return <CreateFeature type={searchParams.type}/>;
}