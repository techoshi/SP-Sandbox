$sw = [Diagnostics.Stopwatch]::StartNew()
webpack
$sw.Stop()
$sw.Elapsed

(get-date).ToString('T')