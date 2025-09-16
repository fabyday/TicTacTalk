#!/usr/bin/env node

import './voice-test-server';

// 간단한 서버 실행 스크립트
console.log('🚀 음성 채팅 테스트 서버 시작 중...');

// 프로세스 종료 시 정리
process.on('SIGINT', () => {
  console.log('\n🛑 서버 종료 중...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 서버 종료 중...');
  process.exit(0);
}); 