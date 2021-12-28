for i in `seq 1 10`; do convert image.png -rotate `expr $i \* 36` image$i.png; zip image$i image$i.png; done

