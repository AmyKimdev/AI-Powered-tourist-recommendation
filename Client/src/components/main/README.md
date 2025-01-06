### 디렉토리 구조

```
PicT_Client
├── public/
├── src/
│   ├── app/ 
│   │   ├── subpage/
│   │   ├── global.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── assets/
│   │   └── images/
│   │   │   └── main/
│   ├── components/
│   │   ├── ui/
│   │   ├── shared/
│   │   ├── main/
│   │   ├── resultmodal/
│   │   └── login-join/
├── .env
├── .gitignore
└── package.json
```

추가 페이지 생성 시 **`app`** 하위에 `page.tsx` 와 `layout.tsx` 만들어서 사용
### gitlab 브랜치 네이밍 규칙

- **주요 브랜치**: **`develop`**
  - 기능개발이 완료된 부분을 병합하는 브랜치
    - 코드가 안정적이고, 테스트를 거친 후 병합됨

---

- **기능 개발 브랜치**: **`feature/*`**
  - 새로운 기능, 버그 수정, 실험 등을 위한 개별 브랜치를 생성
    - 브랜치 이름은 **`feature/*`**, **`bugfix/*`**, **`chore/*`** 등으로 구분하여 명확하게 함
    - **기능 브랜치의 세분화**
      - 큰 기능을 여러 작은 하위 기능으로 나누어 각 하위 기능별로 브랜치를 생성
        - 예를 들어, **`feature/user-management`**를 **`feature/user-login`**, **`feature/user-registration`** 등으로 세분화
    - **중간 통합 브랜치 사용**
      - 여러 사람이 동일한 큰 기능을 작업할 때, 해당 기능을 위한 중간 통합 브랜치를 생성
        - 예를 들어, **`feature/board-system`** 브랜치 아래에 **`feature/board-system/comment`**, **`feature/board-system/post`**와 같은 하위 브랜치를 생성하고, 이들을 중간 통합 브랜치에 병합

---

- **`Master`** 브랜치는 항상 배포 가능한 상태, 모든 변경 사항은 Pull Request를 통해 병합
  - 기능 브랜치가 준비되면 **`develop`** 브랜치에 병합 후 오류가 없을 시 **`Master`**로 병합
    - 코드 리뷰 과정을 거쳐 팀원들이 코드 변경 사항을 검토하고 피드백을 제공
    - 코드 리뷰가 완료되고 승인이 나면, PR을 통해 **`Master`** 브랜치에 병합

---

- CI/CD 통합
  - PR 생성 시 자동으로 테스트가 실행되도록 설정하여 코드 품질을 보장
    - 병합 후 자동으로 배포 프로세스를 실행할 수 있도록 CI/CD 파이프라인을 구축
    - 장점: 단순함, 빠른 배포 주기, 효율적인 코드 리뷰, 자동화
    - 단점: 단순한 프로젝트에 적합, 복잡한 릴리스 프로세스에는 적합하지 않을 수 있음

---

### 코드 작성 시, 네이밍 규칙

- **폴더 및 파일 이름**
  - 폴더 이름: kebab-case 사용 (예: `user-management`, `product-details`)
    - 컴포넌트 파일 이름: PascalCase 사용 (예: `UserList.js`, `ProductDetails.js`)
    - 일반 JS 파일 이름: camelCase 사용 (예: `userService.js`, `productUtilities.js`)

---

- **컴포넌트 이름**
  - PascalCase 사용 (예: `UserList`, `ProductDetails`)

---

- **함수 및 변수 이름**
  - camelCase 사용 (예: `getUserData`, `productPrice`)

---

- **상수 이름**
  - SCREAMING_SNAKE_CASE 사용 (예: `API_URL`, `MAX_PRODUCTS_PER_PAGE`)

---

- **이벤트 핸들러 이름**
  - `handle` 접두사를 붙인 camelCase 사용 (예: `handleClick`, `handleSubmit`)

---

- **API 엔드포인트 이름**
  - kebab-case 사용 (예: `/api/user-management`, `/api/product-details`)

---

- **데이터베이스 테이블 및 컬럼 이름**
  - 테이블 이름: snake_case 사용 (예: `user_profiles`, `product_details`)
    - 컬럼 이름: snake_case 사용 (예: `user_id`, `product_name`)

### 템플릿 사용

### Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
