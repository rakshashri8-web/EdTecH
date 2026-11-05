import { redirect } from "next/navigation";

export default function EnrollRedirect({
  params,
}: {
  params: { courseId: string };
}) {
  redirect(`/payment/${params.courseId}`);
}
