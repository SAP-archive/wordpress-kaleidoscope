<?php 
require_once "Mail.php";
$from = "";  // from email address
$toInformation = ""; // to email address "request more information"
$toFeedback = ""; // to email address feedback
$subject = "[Kaleidoscope]"; 
$host = ""; // email host

$smtp = Mail::factory('smtp', array ('host' => $host, 'auth' => false));

$action=$_REQUEST['action']; 
if ($action=="")    
{ 
    ?>
    <html>
    <head>
        <link rel="stylesheet" href="mail-feedback.css">
    </head>
    <head>
        <link rel="stylesheet" href="mail-feedback.css">
    </head>
    <body>
        <form action="<?= htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES, 'UTF-8'); ?>" method="POST" enctype="multipart/form-data" >
            <div class="form-content">
                <? if (in_array($_REQUEST["interest"], array('info', 'coinnovate'))) { ?>
                <input type="hidden" name="action" value="submit_<?= htmlspecialchars($_REQUEST["interest"], ENT_QUOTES, 'UTF-8'); ?>" style="font-size:24pt" ></input>
                <input type="hidden" name="contacts" value="<?= htmlspecialchars(base64_encode($_REQUEST["contacts"]), ENT_QUOTES, 'UTF-8'); ?>" ></input>
                <input type="hidden" name="slug" value="<?= htmlspecialchars($_REQUEST["slug"], ENT_QUOTES, 'UTF-8'); ?>" ></input>
                <? } else { ?>
                <input type="hidden" name="action" value="submit_general_feedback">
                <? } ?>
                <div class="feedback-headline" style="color: <?= htmlspecialchars($_REQUEST["col"], ENT_QUOTES, 'UTF-8'); ?> !important; -webkit-filter: brightness(140%);">
                    <?= $_REQUEST["interest"] == "info" ? "Do you want more information about the project?" : ($_REQUEST["interest"] == "coinnovate" ? "Co-Innovate with us!" : "Do you have feedback?") ?>
                </div>
                <div class="feedback-headline">
                    <input name="email" type="text" value="" size="30" placeholder="your e-mail address"/>
                    <textarea name="message" rows="7" cols="30" placeholder="Please type in your comments, feedback, questions ... "></textarea>
                </div>
                <div class="send-button-div">
                    <button type="submit" style="background: <?= htmlspecialchars($_REQUEST["col"], ENT_QUOTES, 'UTF-8'); ?>;">Send</button>
                </div>
            </div>
        </form>
    </body></html>
    <?php
}
else {
    $recipients = "";
    $o = base64_decode($_REQUEST["contacts"]);
        //foreach ($o as $v) {
        //      $recipients .= $v["contact_name"] . " <".$v["contact_email"].">; ";
        //}
    $recipients=$o;

    if ($action == "submit_info") {
        $subject .= "[".$_REQUEST["slug"]."] More information requested";
        $to = $toInformation;
    } else if ($action == "submit_coinnovate") {
        $to = $toInformation;
        $subject .= "[".$_REQUEST["slug"]."] Coinnovate with us";
    } else if ($action == "submit_general_feedback") {
        $subject .= " General Feedback";
        $to = $toFeedback;
    }

    $body= "From: ".$_REQUEST['email']."\r\n"."To: ".$recipients."\r\n"."Message: ".$_REQUEST['message'];

    $headers = array ('From' => $from,
       'To' => $to,
       'Subject' => $subject);
    $mail = $smtp->send($to, $headers, $body);
    ?>
    <html>
    <head>
        <script language="javascript" type="text/javascript">
            window.onload = function () {
             parent.document.location = parent.document.location + "?<?php echo htmlspecialchars($action, ENT_QUOTES, 'UTF-8'); ?>";
         }
     </script>
 </head>
 <body>
 </body>
 </html>
 <?php
}
?>

