import pandas as pd

csv_file_1 = 'ETFList.csv'
csv_file_2 = 'nasdaq_list.csv'
csv_file_3 = 'nyse_list.csv'
df1 = pd.read_csv(csv_file_1)
df2 = pd.read_csv(csv_file_2)
df3 = pd.read_csv(csv_file_3)

etf_list = df1.Symbol.values.tolist();
nasdaq_list = df2.Symbol.values.tolist();
nyse_list = df3.Symbol.values.tolist();

master_list = []
for value in etf_list:
    master_list.append(value.strip())
for value in nasdaq_list:
    master_list.append(value.strip())
for value in nyse_list:
    master_list.append(value.strip())

output_list = list(set(master_list))
sorted_output_list = sorted(output_list)

with open("stocks.txt", "w") as output:
    output.write(str(sorted_output_list))