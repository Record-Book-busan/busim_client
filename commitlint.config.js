module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'never'],
    'scope-empty': [2, 'always'],
    'body-max-line-length': [0, 'always', Infinity],
  },
  prompt: {
    settings: {
      enableMultipleScopes: false,
    },
    messages: {
      max: '최대 %d자',
      min: '최소 %d자',
      emptyWarning: '입력값은 비워둘 수 없습니다',
      upperLimitWarning: '입력값이 너무 깁니다',
      lowerLimitWarning: '입력값이 너무 짧습니다',
    },
    questions: {
      type: {
        description: '변경 사항의 타입을 선택하세요',
        enum: {
          feat: {
            description: '새로운 기능',
            title: 'Features',
          },
          fix: {
            description: '버그 수정',
            title: 'Bug Fixes',
          },
          docs: {
            description: '문서 변경',
            title: 'Documentation',
          },
          style: {
            description: '코드 의미에 영향을 주지 않는 변경사항 (공백, 포맷팅, 세미콜론 누락 등)',
            title: 'Styles',
          },
          refactor: {
            description: '버그를 수정하거나 기능을 추가하지 않는 코드 변경',
            title: 'Code Refactoring',
          },
          perf: {
            description: '성능을 향상시키는 코드 변경',
            title: 'Performance Improvements',
          },
          test: {
            description: '테스트 추가 또는 수정',
            title: 'Tests',
          },
          build: {
            description: '빌드 시스템 또는 외부 종속성에 영향을 미치는 변경사항',
            title: 'Builds',
          },
          ci: {
            description: 'CI 구성 파일 및 스크립트 변경',
            title: 'Continuous Integrations',
          },
          chore: {
            description: 'src 또는 test 파일을 수정하지 않는 기타 변경사항',
            title: 'Chores',
          },
          revert: {
            description: '이전 커밋 되돌리기',
            title: 'Reverts',
          },
        },
      },
      subject: {
        description: '변경사항에 대한 간단한 설명을 작성하세요',
      },
      body: {
        description: '변경사항에 대한 자세한 설명을 작성하세요 (1줄):',
      },
    },
  },
}
