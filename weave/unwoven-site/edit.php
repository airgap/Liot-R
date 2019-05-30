<html>
  <head>
    @@/head.html
    <style>
      h1 {
        position: relative;
        top: 50%;
      }
    </style>
    <script>
      load(()=>{
        LiotR.getType({id:<?=$_GET['id']?>}, res => {
          if(!res.err) {
            location.href=
          }
        })
      })
    </script>
  </head>
  <body>
    <h1>Beep boop boop...</h1>
  </body>
  </html>
