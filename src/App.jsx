import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link2,
  Code,
  Image,
  Sun,
  Moon,
  Check,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FONT_FAMILIES = [
  { name: 'Default', value: 'system-ui' },
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Lato', value: "'Lato', sans-serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
];

const RichTextEditor = () => {
  const [htmlOutput, setHtmlOutput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONT_FAMILIES[0]);
  const editorRef = useRef(null);

  const dropdownStyles = isDark ? {
    content: 'bg-gray-800 border-gray-700 text-gray-100 shadow-md shadow-gray-900/50',
    item: 'text-gray-100 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white data-[highlighted]:bg-gray-700 data-[highlighted]:text-white rounded-md',
    menuContent: '[&>*]:text-gray-100 [&>*]:cursor-pointer'
  } : {
    content: 'bg-white border-gray-200',
    item: 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md',
    menuContent: ''
  };

  const buttonBaseClass = isDark ? 
    'border-gray-600 hover:border-gray-500 hover:bg-gray-700 bg-gray-800' : 
    'hover:bg-gray-100';

  const iconBaseClass = isDark ? 'text-gray-100' : 'text-gray-600';

  useEffect(() => {
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap"
    ];

    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, []);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontChange = (font) => {
    setCurrentFont(font);
    handleFormat('fontName', font.value);
  };

  const handleHeading = (level) => {
    handleFormat('formatBlock', `<h${level}>`);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          handleFormat('insertImage', event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      handleFormat('createLink', url);
    }
  };

  const generateHtml = () => {
    const editorContent = editorRef.current?.innerHTML || '';
    setHtmlOutput(editorContent);
  };

  const copyHtml = async () => {
    if (htmlOutput) {
      await navigator.clipboard.writeText(htmlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Card className={`min-h-[calc(100vh-3rem)] flex flex-col shadow-lg ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}>
        <div className={`flex flex-wrap gap-2 p-4 border-b sticky top-0 z-10 transition-colors duration-200 backdrop-blur-sm ${
          isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90'
        }`}>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={`${buttonBaseClass} rounded-full transition-transform hover:scale-110`}
          >
            {isDark ? 
              <Sun className="h-4 w-4 text-yellow-400" /> : 
              <Moon className="h-4 w-4 text-gray-600" />
            }
          </Button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={`${buttonBaseClass} rounded-lg transition-transform hover:scale-105 flex gap-2 min-w-[140px]`}
              >
                <Type className={`h-4 w-4 ${iconBaseClass}`} />
                <span className={`truncate ${iconBaseClass}`}>{currentFont.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={`${dropdownStyles.content} ${dropdownStyles.menuContent} p-2 rounded-lg shadow-xl min-w-[200px] border`}
              sideOffset={5}
              align="start"
            >
              {FONT_FAMILIES.map((font) => (
                <DropdownMenuItem 
                  key={font.name}
                  onClick={() => handleFontChange(font)}
                  className={`${dropdownStyles.item} my-1 p-2 transition-colors cursor-pointer w-full`}
                >
                  <span style={{ fontFamily: font.value }} className="block w-full">
                    {font.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={`${buttonBaseClass} rounded-lg transition-transform hover:scale-105`}
              >
                <Heading1 className={`h-4 w-4 ${iconBaseClass}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={`${dropdownStyles.content} ${dropdownStyles.menuContent} p-2 rounded-lg shadow-xl border`}
              sideOffset={5}
              align="start"
            >
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <DropdownMenuItem 
                  key={level}
                  onClick={() => handleHeading(level)}
                  className={`${dropdownStyles.item} my-1 p-2 transition-colors cursor-pointer w-full`}
                >
                  <div className="flex items-center w-full">
                    {React.createElement(`Heading${level}`, {
                      className: `h-4 w-4 mr-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`
                    })}
                    <span>Heading {level}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {[
            { icon: Bold, command: 'bold' },
            { icon: Italic, command: 'italic' },
            { icon: Underline, command: 'underline' },
            { icon: AlignLeft, command: 'justifyLeft' },
            { icon: AlignCenter, command: 'justifyCenter' },
            { icon: AlignRight, command: 'justifyRight' },
            { icon: Link2, command: handleAddLink },
            { icon: Code, command: () => handleFormat('formatBlock', '<pre>') },
            { icon: Image, command: handleImageUpload }
          ].map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              onClick={typeof item.command === 'function' ? item.command : () => handleFormat(item.command)}
              className={`${buttonBaseClass} rounded-lg transition-transform hover:scale-105`}
            >
              {React.createElement(item.icon, {
                className: `h-4 w-4 ${iconBaseClass}`
              })}
            </Button>
          ))}

          <input
            type="color"
            className={`w-8 h-8 p-0 border rounded-lg cursor-pointer transition-transform hover:scale-105 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}
            onChange={(e) => handleFormat('foreColor', e.target.value)}
          />
        </div>

        <div
          ref={editorRef}
          className={`flex-grow p-8 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
            isDark ? 'text-gray-200' : 'text-gray-900'
          }`}
          contentEditable={true}
          suppressContentEditableWarning={true}
          style={{ 
            minHeight: '200px',
            backgroundColor: isDark ? '#1f2937' : 'white',
            fontFamily: currentFont.value
          }}
        />

        <div className={`p-6 border-t transition-colors duration-200 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex justify-center gap-4 mb-6">
            <Button
              className={`px-8 py-2 bg-gradient-to-r from-teal-400 to-emerald-400 
                hover:from-teal-500 hover:to-emerald-500 
                text-white font-medium shadow-lg 
                hover:shadow-xl transition-all duration-200 
                border-0 rounded-full transform hover:scale-105`}
              onClick={generateHtml}
            >
              Generate HTML
            </Button>
          </div>

          {htmlOutput && (
            <div className={`rounded-xl p-6 border ${
              isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white text-gray-900'
            } shadow-lg relative group`}>
              <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                {htmlOutput}
              </pre>
              <Button
                className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity
                  ${copied ? 'bg-green-500' : 'bg-gray-700'} text-white rounded-full px-4 py-2`}
                onClick={copyHtml}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  'Copy HTML'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RichTextEditor;
