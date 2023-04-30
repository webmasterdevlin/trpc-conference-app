import { PostFormSchemaType } from '@/utils/validators';
import Link from 'next/link';

type Props = {
  item: PostFormSchemaType;
};

export default function Item({ item }: Props) {
  return (
    <div className="max-w-sm p-6 mb-2 bg-white border border-gray-200 rounded-lg shadow ">
      <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
        {item.title}
      </h5>
      <p className="mb-3 font-normal text-gray-500">{item.text}</p>
      <Link href={`/post/${item.id}`}>See our guideline</Link>
    </div>
  );
}
