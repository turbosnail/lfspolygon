# lfspolygon

Use LFS Polygon Draw to identify new areas (streets) without the use of nodes on opened track like FEx FEY (LFS Z30)
used jsDraw2D  - http://jsdraw2d.jsfiction.com/

C++ code to find point in polygon

x,y - curent pozition

polyX[] - array of X polygon points
polyY[] - array of Y polygon points

polySides - count of points

bool Check_Pos(int polySides,int polyX[],int polyY[],float x,float y)
{

    int      i, j=polySides-1 ;
    bool  oddNodes=false     ;

    for (i=0; i<polySides; i++)
    {
        if (polyY[i]<y && polyY[j]>=y
                ||  polyY[j]<y && polyY[i]>=y)
        {
            if (polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x)
            {
                oddNodes=!oddNodes;
            }
        }
        j=i;
    }
    return oddNodes;
}
