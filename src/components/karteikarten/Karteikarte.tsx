import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress" // ShadCN Progress-Komponente
import { Vokabel } from '@/types/vokabel'


  type Props = {
    vokabel: Vokabel
    feedback: 'correct' | 'wrong' | null
  }
  
export function Karteikarte({ vokabel, feedback }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-2xl p-4">
      <CardHeader>
      <Progress value={((vokabel.level ?? 0) / 5) * 100} />
        <div className="text-sm text-gray-500 mb-1">
        Lernfortschritt: Level {vokabel.level ?? 0} von 5
        </div>
      </CardHeader>

      <CardContent className="text-center mt-4">
        <div className="text-3xl font-bold">{vokabel.kanji}</div>
        <div className="text-xl text-gray-600 mt-2">{vokabel.kana}</div>
        <div className="text-sm text-gray-400 mt-1">{vokabel.meaning_de}</div>
      </CardContent>

      <CardFooter className="mt-4 justify-center">
        {feedback === 'correct' && (
          <span className="text-green-600 font-semibold">✔️ Richtig!</span>
        )}
        {feedback === 'wrong' && (
          <span className="text-red-600 font-semibold">✖️ Falsch!</span>
        )}
      </CardFooter>
    </Card>
  )
}
