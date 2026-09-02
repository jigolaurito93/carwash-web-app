import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";

type Props = {
  title?: string;
};

export default function AdminPageHeader({ title }: Props) {
  return (
    <div className="mb-12">
      <div className="flex justify-end">
        <Link
          href="/admin/dashboard"
          className="btnSaveYlw inline-flex items-center gap-2"
        >
          <LiaLongArrowAltLeftSolid className="h-6 w-6 shrink-0" />
          <span>Dashboard</span>
        </Link>
      </div>
      {title ? <h1 className="adminHeader mt-6">{title}</h1> : null}
    </div>
  );
}
