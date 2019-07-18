'use strict';
const clova = require('@line/clova-cek-sdk-nodejs');
const gourmetInfoList = require('./data/gourmet_info_list.json');

module.exports = clova.Client
    .configureSkill()
    //起動時
    .onLaunchRequest(async responseHelper => {
        console.log('onLaunchRequest called!');
        const speechList = [
            clova.SpeechBuilder.createSpeechText(
                'こんにちは！ご当地グルメファインダーへようこそ。ご当地グルメを調べたい都道府県名か、詳しく知りたいご当地グルメの名前を教えてください。'
                )
        ];
        responseHelper.setSpeechList(speechList);
        responseHelper.setReprompt(
            getRepromptMessage(
                clova.SpeechBuilder.createSpeechText(
                    '都道府県名か、ご当地グルメの名前を教えてください。'
                )
            )
        );
    })
    //ユーザーからの発話が来たら反応する箇所
    .onIntentRequest(async responseHelper => {
        console.log('onIntentRequest called!');
        const intent = responseHelper.getIntentName();
        console.log(`Requested Intent: ${intent}`);
        const slots = responseHelper.getSlots();
        switch (intent) {
            case 'Clova.GuideIntent':
                // ヘルプ
                const helpSpeech = [
                    clova.SpeechBuilder.createSpeechText(
                        'ご当地グルメファインダーは、あなたの知りたいご当地グルメを調べられるスキルです。'
                    ),
                    clova.SpeechBuilder.createSpeechText(
                        'ご当地グルメを調べたい都道府県名か、詳しく知りたいご当地グルメの名前を教えてください。'
                    )
                ];
                responseHelper.setSpeechList(helpSpeech);
                responseHelper.setReprompt(
                    getRepromptMessage(
                        clova.SpeechBuilder.createSpeechText(
                            '都道府県名か、ご当地グルメの名前を教えてください'
                        )
                    )
                );
                break;
            case 'FindGourmetByPrefectureIntent':
                // 都道府県に登録されているご当地グルメを検索して返す
                const prefecture = slots.Prefecture;
                console.log(`Prefecture: ${prefecture}`);
                if (prefecture) {
                    // 都道府県名を判別できた場合
                    generateGourmetMessageByPrefecture(prefecture, responseHelper);
                } else {
                    const speechList = [];
                    // 都道府県名を判別できなかった場合
                    speechList.push(
                        clova.SpeechBuilder.createSpeechText(
                            '聞き取れませんでした。もう一度、ご当地グルメを調べたい都道府県名を教えてください。'
                        )
                    );
                    responseHelper.setReprompt(
                        getRepromptMessage(
                            clova.SpeechBuilder.createSpeechText(
                                '都道府県名か、ご当地グルメの名前を教えてください'
                            )
                        )
                    );
                    responseHelper.setSpeechList(speechList);
                }
                break;
            case 'FindGourmetByNameIntent':
                    // ご当地グルメの名前で検索して詳しい情報を返す
                    // const slots = responseHelper.getSlots();
                    const gourmet = slots.Gourmet;
                    console.log(`Gourmet name: ${gourmet}`);
                    if (gourmet) {
                        // ご当地グルメ名を判別できた場合
                        generateGourmetMessageByName(gourmet, responseHelper);
                    } else {
                        const speechList = [];
                        // ご当地グルメ名を判別できなかった場合
                        speechList.push(
                            clova.SpeechBuilder.createSpeechText(
                                '聞き取れませんでした。もう一度、調べたいご当地グルメの名前を教えてください。'
                            )
                        );
                        responseHelper.setReprompt(
                            getRepromptMessage(
                                clova.SpeechBuilder.createSpeechText(
                                    'ご当地グルメの名前を教えてください'
                                )
                            )
                        );
                        responseHelper.setSpeechList(speechList);
                    }
                    break;
            default:
                // どのインテントとしても検出できなかった場合
                responseHelper.setSimpleSpeech(
                    clova.SpeechBuilder.createSpeechText(
                        'ごめんなさい。うまく聞き取れませんでした。'
                    )
                );
                responseHelper.setReprompt(
                    getRepromptMessage(
                        clova.SpeechBuilder.createSpeechText(
                            '都道府県名か、ご当地グルメの名前を教えてください'
                        )
                    )
                );
                break;
        }
    })
    //終了時
    .onSessionEndedRequest(async responseHelper => {
        console.log('onSessionEndedRequest');
    }
).handle();

// 都道府県に応じたご当地グルメ情報メッセージを生成する
function generateGourmetMessageByPrefecture(prefecture, responseHelper) {
    console.log(`function generateGourmetMessageByPrefecture called!`);
    console.log(`Prefecture: ${prefecture}`);
    const gourmets = gourmetInfoList.gourmets;
    const gourmetsInPrefecture = [];
    for (let i = 0; i < gourmets.length; i++) {
        const gourmet = gourmets[i];
        if (gourmet['prefecture'] === prefecture) {
            console.log(`Gourmet[${gourmet.name}] found by ${prefecture}`);
            gourmetsInPrefecture.push(gourmet);
        }
    }
    // Clova のセリフを組み立てる
    const speechList = [];
    const count = gourmetsInPrefecture.length;
    if (count <= 0) {
        // ご当地グルメ情報が登録されていない場合
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                `${prefecture} にはご当地グルメ情報が登録されていませんでした。他の都道府県で試してください。`
            )
        );
        responseHelper.setReprompt(
            getRepromptMessage(
                clova.SpeechBuilder.createSpeechText(
                    '都道府県名か、ご当地グルメの名前を教えてください'
                )
            )
        );
    } else if (count === 1) {
        // ご当地グルメ情報が1件だけ登録されている場合
        const gourmet = gourmetsInPrefecture[0];
        let gourmetDetail = gourmet["detail"];
        if (gourmetDetail.endsWith('。') === false) {
            gourmetDetail += 'です。';
        }
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                `${prefecture} のご当地グルメは ${gourmet["yomi"]} です。${gourmetDetail}`
            )
        );
        responseHelper.endSession();
    } else {
        // ご当地グルメ情報が複数件登録されている場合
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                `${prefecture} には、${gourmetsInPrefecture.length} 件のご当地グルメが登録されています。`
            )
        );
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                '詳しく知りたいご当地グルメがあればお調べしますので、ご当地グルメの名前をお知らせください。'
            )
        );
        let gourmetNames = '';
        for (let i = 0; i < gourmetsInPrefecture.length; i++) {
            const gourmet = gourmetsInPrefecture[i];
            gourmetNames += gourmet["yomi"] + '、';
        }
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                `登録されているご当地グルメは、${gourmetNames} です。`
            )
        );
    }
    responseHelper.setSpeechList(speechList);
}

// ご当地グルメ名に応じたご当地グルメ情報メッセージを生成する
function generateGourmetMessageByName(gourmetName, responseHelper) {
    console.log(`function generateGourmetMessageByName called!`);
    console.log(`Gourmet name: ${gourmetName}`);
    const gourmets = gourmetInfoList.gourmets;
    let gourmet = null;
    for (let i = 0; i < gourmets.length; i++) {
        const g = gourmets[i];
        if (g['name'] === gourmetName) {
            console.log(`Gourmet[${g.name}] found!`);
            gourmet = g;
        }
    }
    // Clova のセリフを組み立てる
    const speechList = [];
    if (gourmet) {
        // ご当地グルメ情報が登録されている場合
        let gourmetDetail = gourmet["detail"];
        if (gourmetDetail.endsWith('。') === false) {
            gourmetDetail += 'です。';
        }
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                `${gourmet["yomi"]} わ、${gourmet["prefecture"]}のご当地グルメです。${gourmetDetail}`
            )
        );
        responseHelper.endSession();
    } else {
        // ご当地グルメ情報が見つからない場合
        speechList.push(
            clova.SpeechBuilder.createSpeechText(
                `${gourmetName} という名前のご当地グルメ情報が見つかりませんでした。もう一度教えてください。`
            )
        );
        responseHelper.setReprompt(
            getRepromptMessage(
                clova.SpeechBuilder.createSpeechText(
                    '調べたいご当地グルメの名前を教えてください。'
                )
            )
        );
    }
    responseHelper.setSpeechList(speechList);
}

// リプロント
function getRepromptMessage(speechInfo) {
    const speechObject = {
        type: 'SimpleSpeech',
        values: speechInfo,
    };
    return speechObject;
}
