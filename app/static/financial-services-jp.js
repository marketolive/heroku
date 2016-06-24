$(document).ready(function(){
	$('#fullpage').fullpage({
        	anchors:['FinancialServices', 'IncreaseBorrowerPipeline', 'DriveLoanRevenue', 'MeasureSuccess'],
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
 //        	anchors:['FinancialServices', 'IncreaseBorrowerPipeline', 'DriveLoanRevenue', 'MeasureSuccess'],
 //        	verticalCentered: true,
 //        	resize: false
 //    	});
	//     $('.arrow-container-down').click(function(){
	//       $.fn.fullpage.moveSectionDown();
	//     });

	//     $('.arrow-container-up').click(function(){
	//       $.fn.fullpage.moveSectionUp();
	//     });
	// }

	$('.section2-options, .section3-options, .section4-options, .section5-options').hover(function(){
		var order = $(this).attr('data-order');
		order = order.split('-');
		var section = order[0];
		order = order[1];

		$(this).parent().siblings('div').children('div').css({'background-color':'white', 'color':'black', 'cursor':'pointer'})
		
		var position = b2b[section][order]["bp"];
		
		$(this).css({'color': 'white', 'background-color': '#5a54a4'});
		$('#'+section+'-header').text(b2b[section][order]["header"]);
		$('.'+section+'-copy').text(b2b[section][order]["description"]);
		$('.'+section+'-image-container').css("background-position", position);
	});

	$('.section2-options').first().css({'color':'white'});
	$('.section3-options').first().css({'color':'white'});
	$('.section4-options').first().css({'color':'white'});
	$('.section5-options').first().css({'color':'white'});
});

// $(window).resize(function(){
// 	if($(window).width() < 999) {
// 		console.log("did it register?");
// 	    $('#fullpage').fullpage({
// 	    	scrollingSpeed: 7000,
// 	    	autoScrolling: false
// 	    });
// 	    $('.inner-arrow-container').css("display", "none");
	   
// 	}
// 	else if($(window).width() > 999) {
		
// 		$('#fullpage').fullpage();

// 		$('.inner-arrow-container').css("display", "block");
		
// 	}
// });

var b2b = {
	section2: [
	{"header": "検索の最適化", "description": "Marketo SEOは、マーケターがSEOの専門的な知識がなくても、教育機関のWebサイト、ランディングページへ質の高いトラッフィク、潜在的な学生を増やすことをサポートします。", "bp":"0% 0%"},
	{"header": "志願者の獲得", "description": "関心を引きつけるランディングページと登録フォームで志願者をより多く獲得します", "bp":"58% 0%"},
	{"header": "ソーシャルプロモーション", "description": "Marketoはマーケティング戦略の様々な局面で活用できる統合されたソーシャルマーケティングを提供しています。Marketoは貴社のサービスに関心のある顧客を見つけ、長期的な顧客へと変化させ関係を維持することをサポートします。", "bp":"116% 0%"}
	],
	section3: [
	{"header": "メールマーケティング", "description": "Marketoのメール機能ならマーケターがベストプラクティスに則って即座にメールによる施策を実行に移すことを可能にします。真にパーソナライズされた顧客体験を登録者に提供し、エンゲージメントを高めます。", "bp":"0% 0%"},
	{"header": "リターゲティング", "description": "MarketoAdブリッジはMarketoのリッチな行動データをFacebook,Google,その他の広告プラットフォームと連携させます。マーケターはターゲットとなる申込を検討中のお客様に関連性のある広告でターゲティングできるようになります", "bp":"30% 0%"},
	{"header": "ナーチャリング", "description": "ナーチャリングとは様々なチャネルを通じて見込顧客、既存顧客との関係を構築するプロセスです。ナーチャリングの目標は、適切なコンテンツを提供し見込顧客がカスタマージャーニーをスムーズに進んでいくことです。現在では見込顧客のうち95%は企業のWebサイトを訪問、製品やサービスについて調査、内70%がその企業や競合企業から最終的に購入する傾向があります", "bp":"63% 0%"},
	{"header": "イベント", "description": "見込み顧客や既存顧客に向けてメール、Web、モバイル、イベント、ソーシャルメディアなどを含むすべてのチャネルを活用してマーケティングプログラムを効果的に実行、管理します。", "bp":"100% 0%"},
	],
	section4: [
	{"header": "ライフタイムエンゲージメント", "description": "Marketoのエンゲージメントスコアはマーケターがすぐに、かつ簡単にコンテンツのパフォーマンスを測定するための指標です。", "bp":"0% 0%"},
	{"header": "ROI分析", "description": "プログラムの効果を測定し、最もROIの高かったプログラムを特定します。これによりROIの高いプログラムやチャネルにマーケティング活動を注力することができるようになります。", "bp":"48% 0%"},
	{"header": "ダッシュボード&アドバンストアナリティクス", "description": "マーケターが直感的な操作でアドホックレポート、ダッシュボードが作成できます。必要な時に必要なデータを取り出します。", "bp":"100% 0%"}
	]
}


