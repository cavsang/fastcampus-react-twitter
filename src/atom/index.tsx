import { atom } from "recoil";

export type LanguageType = "ko" | "en";

export const languageState = atom<LanguageType>({
    key: "language",
    //localstorage를 사용한이유는 새로고침을 하면 한국어/영어 부분이 새로고침된다.
    //그래서 localstorage에 저장했다가 사용하고 없으면 기본값으로 ko가 되도록...
    default: localStorage.getItem('language') as LanguageType || "ko",
});