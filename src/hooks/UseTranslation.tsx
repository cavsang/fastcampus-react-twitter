import { useRecoilValue } from "recoil";
import { languageState } from "atom";
import TRANSLATATIONS from "constants/language";

export default function UseTranslation(){
    const lang = useRecoilValue(languageState);
    return (key: keyof typeof TRANSLATATIONS) => {
        return TRANSLATATIONS[key][lang];
    }
}