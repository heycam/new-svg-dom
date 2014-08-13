#!/usr/bin/env perl -w

use strict;

open FH, '>index.html';
print FH <<EOF;
<!DOCTYPE html>
<meta charset=utf-8>
<title>New SVG DOM examples</title>
<ul>
EOF

opendir DIR, '.';
while (readdir DIR) {
  next unless -f;
  next if $_ eq 'index.html';
  next unless /\.html$/;
  print FH "  <li><a href=\"$_\">$_</a></li>\n";
}

print FH <<EOF;
</ul>
EOF
