$word = New-Object -ComObject Word.Application
$word.Visible = $false

$doc = $word.Documents.Open("c:\Users\VICTUS\Desktop\lenght\IMeasurement_PRD.docx")
$doc.Content.Text | Out-File -FilePath "c:\Users\VICTUS\Desktop\lenght\IMeasurement_PRD.txt" -Encoding utf8
$doc.Close()

$doc2 = $word.Documents.Open("c:\Users\VICTUS\Desktop\lenght\IMeasurement_TRD.docx")
$doc2.Content.Text | Out-File -FilePath "c:\Users\VICTUS\Desktop\lenght\IMeasurement_TRD.txt" -Encoding utf8
$doc2.Close()

$word.Quit()
