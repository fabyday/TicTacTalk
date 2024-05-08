call conda activate tictactalk 
if %ERRORLEVEL% == 0 goto :endofscript
echo "env tictactalk is not exists, create new one."
echo y | conda create -n "tictactalk" python=3.10
conda activate tictactalk
pip install -r requirements.txt

:endofscript
echo "Script complete"