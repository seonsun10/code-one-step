// Next.js 16.4.3 reference examples for final static-site lessons.
// These snippets are for reading; the learning site does not run Next.js.
export const reviewedReleaseExamples = {
  31: [
    String.raw`// next.config.ts
const nextConfig = {
  output: "export",
};

export default nextConfig;

// next build가 정적 HTML·CSS·JavaScript를 out/에 만들어요.`,
    String.raw`// app/catalog.json/route.ts
export const dynamic = "force-static";

const catalog = [{ slug: "react-state", title: "React 상태" }];

export async function GET() {
  return Response.json(catalog);
}

// 요청 때 값을 읽지 않는 GET 응답은 정적 파일로 만들 수 있어요.`,
    String.raw`// app/lessons/[slug]/page.tsx
export function generateStaticParams() {
  return [
    { slug: "react-state" },
    { slug: "java-methods" },
  ];
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}

// 반환한 경로만 정적 파일을 만들 때 미리 알 수 있어요.`,
    String.raw`// app/api/progress/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: true, body });
}

// 이 예제는 요청을 받았다는 응답만 해요. 실제 저장은 서버 저장소에 연결해야 해요.
// 요청 본문을 처리하는 POST에는 서버 실행 환경이 필요해요. 정적 export에서는 실행할 수 없어요.`,
    String.raw`"use client";
import { useEffect, useState } from "react";

export function SavedMarker() {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(localStorage.getItem("saved") === "true");
  }, []);

  return <p>{saved ? "이 브라우저에 저장했어요." : "이 브라우저에 저장한 기록이 없어요."}</p>;
}

// 서버와 브라우저의 첫 화면은 같은 초기값으로 그려요.`,
  ],
  32: [
    String.raw`const exportPlan = {
  buildCommand: "next build",
  staticOutputDirectory: "out",
  hostInput: "out/ 안의 파일",
  requestTimeNodeServer: false,
} as const;

// 원본 코드 폴더가 아니라 빌드 산출물을 정적 호스트에 올려요.`,
    String.raw`// next.config.ts
const nextConfig = {
  basePath: "/study",
};
export default nextConfig;

// components/TrackNavigation.tsx
import Link from "next/link";
import Image from "next/image";

export function TrackNavigation() {
  return (
    <nav aria-label="학습 경로">
      <Link href="/tracks">과정 목록</Link>
      <Image src="/study/brand-mark.svg" alt="" width={32} height={32} />
    </nav>
  );
}

// Link 경로에는 basePath가 붙어요. next/image의 src에는 접두 경로를 직접 넣어요.`,
    String.raw`// app/components/site-name.tsx
"use client";

export function SiteName() {
  // NEXT_PUBLIC_에는 브라우저에 공개해도 되는 값만 넣어요.
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  return <p>{siteName}</p>;
}

// lib/payment-secret.ts
import "server-only";

// 결제 비밀 키는 서버 전용 파일에서만 읽어요.
export const paymentSecret = process.env.PAYMENT_SECRET;`,
    String.raw`// app/components/build-info.tsx
"use client";

// 공개 환경 변수는 빌드할 때 브라우저 JavaScript에 값으로 들어가요.
const builtPublicSettings = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME,
  builtFor: process.env.NEXT_PUBLIC_DEPLOY_TARGET,
} as const;

// 같은 파일을 다른 환경으로 옮겨도 환경 변수 값은 바뀌지 않아요.
// 공개 환경 변수 값을 바꾸려면 다시 빌드해요.`,
    String.raw`const releaseChecklist = {
  staticBuild: "pending",
  routeFiles: "pending",
  subpathAssets: "pending",
  browserSecretScan: "pending",
  providerPricingAndTerms: "공식 요금·약관 확인 전",
  hostPreview: "pending",
} as const;

// 항목을 실제로 확인한 뒤에만 검수 근거로 기록해요.`,
  ],
  33: [
    String.raw`const routeCases = [
  { path: "/tracks", outcome: "과정 목록" },
  { path: "/tracks/react/lessons/state", outcome: "강의" },
  { path: "/tracks/missing", outcome: "찾을 수 없음" },
] as const;

const interactionCases = ["키보드 이동", "빈 결과", "불러오는 중", "오류", "저장 완료"] as const;`,
    String.raw`const publishedLessons = [
  { slug: "react-state", title: "React 상태" },
] as const;

const progressLocation = "현재 브라우저 프로필";
const crossDeviceTransfer = "JSON 파일을 직접 내보내고 가져오기";
const accountSync = "지원하지 않음";

// 공개 강의 자료와 브라우저에 저장하는 개인 진도는 저장 범위가 달라요.`,
    String.raw`"use client";
import { useState } from "react";

export function ProgressToggle({ initial }: { initial: boolean }) {
  const [done, setDone] = useState(initial);
  return (
    <button type="button" aria-pressed={done} onClick={() => setDone(!done)}>
      {done ? "완료" : "완료 표시"}
    </button>
  );
}

// 상호작용에 필요한 상태만 이 작은 위젯에서 관리해요.`,
    String.raw`const verificationPlan = [
  "운영용 빌드와 정적 파일 목록 확인",
  "각 경로 직접 진입과 내부 링크 이동",
  "키보드 초점, 접근 가능한 이름, 빈 결과와 오류 상태",
  "하위 경로의 자산 주소와 브라우저 저장 기록 복원",
  "실제 정적 호스트의 미리보기 확인",
] as const;

// 실행하지 않은 계획은 통과 근거가 아니에요.`,
    String.raw`const deliveryReport = {
  verified: ["통과한 경로 또는 검사 이름을 적어요"],
  conceptOnly: ["Next.js Route Handler와 Server Action 예제"],
  unsupportedHere: ["요청별 Node 서버", "계정 간 진도 동기화"],
  unrunChecks: ["호스트 미리보기", "브라우저에서 직접 경로 열기"],
  deploymentPublished: false,
} as const;

// 실제 근거가 아닌 임시 문구나 숫자를 검수 결과로 공개하지 않아요.`,
  ],
};
