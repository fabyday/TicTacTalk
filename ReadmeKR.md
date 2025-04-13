# TicTacTalk


<p align="center">
<img width="100%" height="40%" src="./images/main.jpg"/>
</p>


틱택톡은 사설 보이스톡 프로그램입니다. 보이스 서버와 클라이언트를 모두 포함하고 있습니다. 서버에 접속을 원하는 유저들을 서버의 주소를 통해 바로 대화에 참여할 수 있어요.


## Features
- 아이디, 패스워드 불필요(설정시)
- 적은 인원을 위한 작은 커뮤니티


## 기술 스택

### 클라이언트

| 분류       | 이름                            | 설명 |
|------------|---------------------------------|------|
| UI 프레임워크 | [Tailwind CSS](https://tailwindcss.com/) + [Headless UI](https://headlessui.com/) | 유틸리티 기반 CSS와 접근성 좋은 UI 컴포넌트 |
| 아이콘       | [Lucide](https://lucide.dev/), [Phosphor Icons](https://phosphoricons.com/) | 심플하고 커스터마이징 쉬운 아이콘들 |
| 애니메이션    | [Framer Motion](https://www.framer.com/motion/) | 리액트용 고급 애니메이션 라이브러리 |
| 드래그/정렬   | [dnd-kit](https://dndkit.com/), [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) | Drag & Drop 인터랙션을 위한 도구들 |
| 상태 관리    | [Zustand](https://zustand-demo.pmnd.rs/) | 작고 직관적인 리액트 상태 관리 라이브러리 |


### Server
| 분류     | 이름                                  | 설명 |
|----------|---------------------------------------|------|
| 백엔드   | [NestJS](https://nestjs.com/)         | 구조적이고 타입 안정성이 뛰어난 Node.js 백엔드 프레임워크 |

### 지원 코덱

**오디오** : **Opus**


## prerequirements
python version : 3.10
```
pip install -r requirements.txt
```
depend On OPUS library

download opus.dll in your environmentpath or its library


<p align="center">
<img width="50%" src="./images/loading.gif"/>
</p>





## MIT 라이센스
Copyright (c) 2024 fabyday

본 소프트웨어 및 관련 문서 파일들(이하 "소프트웨어")의 사본을 입수하는 모든 사람에게, 
소프트웨어를 제한 없이 다룰 수 있는 권한을 무상으로 부여합니다. 
여기에는 소프트웨어를 사용, 복사, 수정, 병합, 출판, 배포, 서브라이선스, 
또는 판매할 수 있는 권리와, 소프트웨어를 제공받은 사람이 그렇게 할 수 있도록 허용하는 권리가 포함됩니다.

다음 조건을 충족해야 합니다:

위 저작권 표시와 본 허가 조항은 소프트웨어의 모든 사본 또는 상당 부분에 포함되어야 합니다.

본 소프트웨어는 "있는 그대로"(AS IS) 제공되며, 상품성, 특정 목적에의 적합성, 
비침해에 대한 묵시적 보증을 포함하되 이에 제한되지 않는 어떠한 형태의 보증도 제공되지 않습니다. 
어떠한 경우에도 저작권자 또는 권리자는 계약, 불법행위 또는 그 밖의 행위로 인해 발생한 
손해나 기타 책임에 대해 책임을 지지 않습니다. 이는 소프트웨어 또는 소프트웨어의 사용이나 
기타 거래와 관련된 경우에도 마찬가지입니다.


