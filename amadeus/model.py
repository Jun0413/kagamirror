import pickle

import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix
from sklearn.preprocessing import StandardScaler

model_name = "model-v4.pkl"
TRAIN_PATH = "./dataset/train-v4.csv"
TEST_PATH = "./dataset/test-v4.csv"

def prepare_data():
    # load data
    train = pd.read_csv(TRAIN_PATH)
    test = pd.read_csv(TEST_PATH)
    
    # clean data
    train['grade'] = train['grade'].map({'A':0,'B':1,'C':2})
    test['grade'] = test['grade'].map({'A':0,'B':1,'C':2})
    train.pop('person_id-question_id')
    test.pop('person_id-question_id')

    # split data
    X_train = train.drop('grade', axis=1).values
    X_train = StandardScaler().fit_transform(X_train)
    y_train = train['grade'].values
    X_test = test.drop('grade', axis=1).values
    X_test = StandardScaler().fit_transform(X_test)
    y_test = test['grade'].values
    print("data loaded")

    return X_train, y_train, X_test, y_test

def train(save=True):
    # load data
    X_train, y_train, X_test, y_test = prepare_data()

    # use SVM
    # """
    clf = SVC(kernel='rbf')
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    # """

    # use RandomForest
    """
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    """

    # print results
    print("training finished, metrics are: ")
    print(confusion_matrix(y_test,y_pred))
    print(np.sum(y_test == y_pred)/float(len(y_test)))

    # save model
    if save:
        with open(model_name, 'wb') as fp:  
            pickle.dump(clf, fp)
        print("model saved as {0}".format(model_name))

def load_model():
    with open(model_name, 'rb') as fp:
        clf = pickle.load(fp)
    return clf

def int2label(int_grade):
    mapping = {
        0: 'A',
        1: 'B',
        2: 'C'
    }
    return mapping[int_grade]

"""
For speech grader to call
- X_test: array of features in order
- return list of categorical grades
"""
def predict(features):
    clf = load_model()
    features = StandardScaler().fit_transform(np.array(features))
    preds = clf.predict(features)
    return list(map(lambda grade: int2label(grade), preds))

if __name__ == '__main__':
    train()