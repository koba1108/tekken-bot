import * as functions from 'firebase-functions';
import {conversation} from '@assistant/conversation';
import {Intent} from '@assistant/conversation/dist/api/schema';

interface AskParams {
  character: string
  skill: string
  target: string
}

const getAskParams = (intent: Intent): AskParams => {
  return {
    character: intent.params!.character.resolved || intent.params!.character.original || '',
    skill: intent.params!.skill.resolved || intent.params!.skill.original || '',
    target: intent.params!.target.resolved || intent.params!.target.original || '',
  }
}

const appName = '鉄拳のアプリ'
const app = conversation({debug: true})

app.handle('main', conv => {
  conv.add(`私は${appName}です。ご用件は何でしょうか？`)
})

app.handle('ask', conv => {
  // パラメータ取得
  const p: AskParams = getAskParams(conv.intent)

  // todo: SQLからデータ取得

  // レスポンスの文字を作成
  const result = `${p.character}の${p.skill}の${p.target}`
  const res = `あなたが知りたいのは、${result}の事で合ってますか？`

  conv.add(res)
})

app.catch((conv, e) => {
  console.error('conv', conv);
  console.error('error', e);
  conv.add('error close');
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app)
