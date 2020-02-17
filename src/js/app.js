import * as jsonc from 'jsonc-parser';
import * as json5 from 'json5'
import * as hjson from 'hjson'
import * as yaml from "js-yaml"

$(function () {


    $("#JSONC-sample").on("click", function () {
        $("#raw").val(`{
    // コメント
    
    /* 
        コメント
    */

    "文字列": "文字列",
    "数値": 0,
    "真偽値": true,
    "null値": null,
    "配列": [
        "要素1",
        "要素2"
    ],
    "オブジェクト": {
        "キー": "値"
    }
}`)
    });

    $("#JSON5-sample").on("click", function () {
        $("#raw").val(`{
    /* 
        コメント
    */

    // キーはダブルクォートが不要
    // シングルクォートも使える
    文字列1: '文"字"列',
    // ヒアドキュメント
    // \\nで改行文字を挿入
    文字列2: "文\\\n字\\n列",
    // 16進表記とか使える
    数値: [
        0xdecaf,
        NaN,
        +Infinity,
        -Infinity
    ],
    // ケツカンマ OK
    配列: [
        "要素",
    ],
    オブジェクト: {
        "キー": "値",
    }
}`);
    });

    $("#HJSON-sample").on("click", function () {
        $("#raw").val(`{
    #   コメント
    //  コメント
    /*
        コメント
    */

    // キーも値もダブルクォートが不要
    文字列1: 文字列

    // ヒアドキュメント
    文字列2:'''
        文
        字
        列
    '''

    // カンマなしOK
    配列: [
        要素1
        要素2
        3
    ]

    // ケツカンマも OK
    オブジェクト: {
        "キー": "値",
    }
}`);

    });

    $("#YAML-sample").on("click", function () {

        $("#raw").val(`# コメント行
{
    "文字列": "文字列",
    "数値": 0,
    "真偽値": true,
    "null値": null,
    "配列": [
        "要素1",
        "要素2"
    ],
    "オブジェクト": {
        "キー": "値"
    }
}`);

    });


    $("#JSONC").on("click", function () {
        try {
            console.log(jsonc.parse($("#raw").val()))
            $("#json").html(
                syntaxHighlight(
                    json5.stringify(
                        jsonc.parse($("#raw").val()), {
                        replacer: null,
                        space: 4,
                        quote: '"'
                    })
                ))
        } catch (e) {
            $("#json").html(e)
        }
    })

    $("#JSON5").on("click", function () {
        try {
            console.log(json5.parse($("#raw").val()))
            $("#json").html(
                syntaxHighlight(
                    json5.stringify(
                        json5.parse($("#raw").val()), {
                        replacer: null,
                        space: 4,
                        quote: '"'
                    })
                ))
        } catch (e) {
            $("#json").html(e)
        }
    })


    $("#HJSON").on("click", function () {
        try {
            console.log(hjson.parse($("#raw").val()))
            $("#json").html(syntaxHighlight(
                json5.stringify(
                    hjson.parse($("#raw").val()
                    ), {
                    replacer: null,
                    space: 4,
                    quote: '"'
                })))
        } catch (e) {
            $("#json").html(e)
        }
    })

    $("#YAML").on("click", function () {
        try {
            console.log(yaml.safeLoad($("#raw").val()))
            $("#json").html(syntaxHighlight(
                JSON.stringify(
                    yaml.safeLoad($("#raw").val(), { onWarning: true }), undefined, 4)
            ))
        } catch (e) {
            $("#json").html([e.name, e.reason].join("\n"))
        }
    })

    function syntaxHighlight(json) {
        return json.replace(/(.)*:|("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null|NaN|Infinity)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/:$/.test(match)) {
                cls = 'key';
            } else if (/^"/.test(match)) {
                cls = 'string';
                match = match.replace(/\\n/g, '\n')
            } else if (/NaN|Infinity/.test(match)) {
                cls = 'number'
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
})