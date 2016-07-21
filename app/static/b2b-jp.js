$(document).ready(function(){
  $('#fullpage').fullpage({
          anchors:['B2B-Marketing', 'DriveMoreAwareness', 'EngageYourCustomer', 'AlignWithSales', 'MeasureYourSuccess'],
          verticalCentered: true,
          resize: false
      });
      $('.arrow-container-down').click(function(){
        $.fn.fullpage.moveSectionDown();
      });
      $('.arrow-container-up').click(function(){
        $.fn.fullpage.moveSectionUp();
      });
  // if($(window).width() > 999) {
  //     $('#fullpage').fullpage({
 //         anchors:['B2B-Marketing', 'DriveMoreAwareness', 'EngageYourCustomer', 'AlignWithSales', 'MeasureYourSuccess'],
 //         verticalCentered: true,
 //         resize: false
 //     });
  //     $('.arrow-container-down').click(function(){
  //       $.fn.fullpage.moveSectionDown();
  //     });
  //     $('.arrow-container-up').click(function(){
  //       $.fn.fullpage.moveSectionUp();
  //     });
  // }

  $('.section2-options, .section3-options, .section4-options, .section5-options').hover(function(){
    // mouse enter function
    var order = $(this).attr('data-order');
    order = order.split('-');
    var section = order[0];
    order = order[1];

    // removing the purple from the first child on hover
    $(this).parent().siblings('div').children('div').css({'background-color':'white', 'color':'black', 'cursor':'pointer'})
    
    var position = b2b[section][order]["bp"];
    
    $(this).css({'color': 'white', 'background-color': '#5a54a4'});
    $('#'+section+'-header').text(b2b[section][order]["header"]);
    $('.'+section+'-copy').text(b2b[section][order]["description"]);
    $('.'+section+'-image-container').css("background-position", position);
  });
  
  //set first option in each section color to white
  $('.section2-options').first().css({'color':'white'});
  $('.section3-options').first().css({'color':'white'});
  $('.section4-options').first().css({'color':'white'});
  $('.section5-options').first().css({'color':'white'});
});

// $(window).resize(function(){
//  if($(window).width() < 999) {
//    // console.log("did it register?");
//      $('#fullpage').fullpage({
//        scrollingSpeed: 7000,
//        autoScrolling: false
//      });
//      $('.inner-arrow-container').css("display", "none");
     
//  }
//  else if($(window).width() > 999) {
    
//    $('#fullpage').fullpage();

//    $('.inner-arrow-container').css("display", "block");
    
//  }
// });


var b2b = {
  section2: [
  {"header": "検索の最適化", "description": "Marketo SEOは、マーケターがSEOの専門的な知識がなくても、企業のWebサイト、ランディングページへ質の高いトラッフィクを増やすことをサポートします。", "bp":"-2% 0%"},
  {"header": "ソーシャルプロモーション", "description": "Marketoパーソナライゼーションはターゲティングした個人に対して、メール、Web、広告、モバイルを通して、コミュニケーションを動的にパーソナライズさせます。CMSは不要でITチームのサポートなしで実装可能です", "bp":"49% 0%"},
  {"header": "パーソナライゼーション", "description": "Marketoソーシャルマーケティングは、見込顧客、既存顧客が企業のメッセージを知人に簡単に共有できるようサポートしています。最近のForrester調査レポートによると、消費者の70%は友人からのおすすめを信用しますが、広告を信頼する人は10%にしか及びません。", "bp":"99% 0%"}
  ],
  section3: [
  {"header": "自動化", "description": "多くの部署、地域で実施されているすべてのマーケティングプログラムを把握し、調整することは非常に難しいことです。Marketoマーケティングカレンダーは日々実施されている様々なマーケティング活動を全体で把握、効率良く計画、調整、そして他のチームへ共有することを可能にします。", "bp":"0% 0%"},
  {"header": "バッチ", "description": "従来型のメールキャンペーンであれば、バッチメールプログラムで簡単にプログラムの作成、配信ができます。コントロールパネルから対象者を定義し、コンテンツを選択、スケジュールを設定するだけ、数分で完了です。", "bp":"20% 0%"},
  {"header": "ドリップ", "description": "ドリップメールキャンペーンは指定した期間で一連のメールを配信するのに活用されます。Marketoではドリップメールプログラムの作成と実行は非常に簡単です。キャンペーンウィザードから対象者を定義し、コンテンツを配信するタイミング、条件を設定、そしてスケジュールするだけ、数分で完了です", "bp":"40% 0%"},
  {"header": "ナーチャリング", "description": "ナーチャリングとは様々なチャネルを通じて見込顧客、既存顧客との関係を構築するプロセスです。ナーチャリングの目標は、適切なコンテンツを提供し見込顧客がカスタマージャーニーをスムーズに進んでいくことです。現在では見込顧客のうち95%は企業のWebサイトを訪問し、製品やサービスについて調査、そのうち70%がその企業や競合企業から最終的に購入する傾向があります。", "bp":"60% 0%"},
  {"header": "イベント", "description": "イベントは見込顧客や既存顧客とダイレクトにエンゲージメントするために、従来の展示会やWebセミナーのようなオンラインイベントを簡単に設計、実行することを可能にします。", "bp":"80% 0%"},
  {"header": "カレンダー", "description": "多くの部署、地域で実施されているすべてのマーケティングプログラムを把握し、調整することは非常に難しいことです。Marketoマーケティングカレンダーは日々実施されている様々なマーケティング活動を全体で把握、効率良く計画、調整、そして他のチームへ共有することを可能にします。", "bp":"100% 0%"}
  ],
  section4: [
  {"header": "リードスコアリング", "description": "リードスコアリングはマーケティングと営業が連携するための手法で、営業が案件にアタッチするタイミングを見極めるために見込顧客の優先順位付けをします。企業への関心、購買サイクルでの現ステージ、ニーズが自社ビジネスとどれほどマッチしているかなどを基にスコア付けします。", "bp":"-5% 0%"},
  {"header": "営業への通知", "description": "自動化プログラムはトリガーを使い、見込顧客の特定の行動をリアルタイムで捉え、メール送信、営業担当者へのアラート通知、スコアリングいった適切なアクションを瞬時に実行します。CRMシステムと連携せずとも確度の高い見込顧客を営業に通知しアクションを取ることを可能にします。", "bp":"48% 0%"},
  {"header": "セールスインサイト", "description": "Marketoは、Salesforce.comなどのCRMと連携し、精度の高いアクティビティデータを送受信、最新情報に基づいて営業が行動を起こすことをサポートします。例えば、自分の担当顧客のWebアクセス、メール開封、資料のダウンロード、SNSへのシェアしているかなどを、ほぼリアルタイムで知ることができます。", "bp":"100% 0%"}
  ],
  section5: [
  {"header": "エグゼクティブダッシュボード", "description": "多くのCRMやMAソフトでは施策の貢献度はシングルタッチ（例：リードソース）でしか測定することしかできません。Marketoではシングルタッチのみならず、マルチタッチで測定することができ、施策に対する正確な判断が行えます", "bp":"0% 0%"},
  {"header": "コンテンツ分析", "description": "メールでのエンゲージメントの成功可否を判定するための指標として、メールの開封、クリックのみでは不十分です。Marketoではターゲット層に対するEnd to Endでのコンテンツのエンゲージメントを独自のアルゴリズムで計算しています。最初に送信されたメールから最後に送信されたメールまですべての要素がエンゲージメントスコアとして、計算されます。", "bp":"50% 0%"},
  {"header": "レポーティング", "description": "Marketoの分析/レポーティングでは、実施しているマーケティング活動のパフォーマンスを把握し、様々な確度から分析すること可能です。これにより次の意思決定をスムーズに行えるようになります。", "bp":"100% 0%"}
  ]
}

